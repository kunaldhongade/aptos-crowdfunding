module my_addrx::CrowdfundingPlatform {
    use std::coin::{transfer};
    use std::aptos_coin::AptosCoin;
    use std::signer;
    use std::string::String;
    use std::vector;
    use std::timestamp;

    const ERR_PROJECT_NOT_FOUND: u64 = 1;
    const ERR_NO_PROJECTS: u64 = 2;
    const ERR_ALREADY_INITIALIZED: u64 = 3;

    const Global_Project_List: address = @sys_addrx;

    // Struct representing a donation made by a backer
    struct Donation has key, store, copy, drop {
        backer: address,      // Backer's address
        project_id: u64,      // ID of the project being backed
        amount: u64,          // Amount donated
        timestamp: u64,       // Timestamp of the donation
    }

    // Struct representing a crowdfunding project
    struct Project has key, store, copy, drop {
        id: u64,
        creator: address,   // Creator's address
        title: String,      // Project title
        description: String,// Project description
        goal: u64,          // Funding goal (APT tokens)
        total_funds_raised: u64, // Total funds raised (for viewing purposes only)
    }

    // Global struct representing the collection of all projects and donations
    struct GlobalProjectCollection has key, store, copy, drop {
        projects: vector<Project>,
        donations: vector<Donation>,   // List of all donations made
        last_project_id: u64,          // Tracks the last used project ID
    }

    // Initialize the global crowdfunding platform (only called once)
    public entry fun init_platform(account: &signer) {
        let global_address = Global_Project_List;

        if (exists<GlobalProjectCollection>(global_address)) {
            abort(ERR_ALREADY_INITIALIZED)
        };

        let project_collection = GlobalProjectCollection {
            projects: vector::empty<Project>(),
            donations: vector::empty<Donation>(),
            last_project_id: 1000,
        };

        move_to(account, project_collection);
    }

    // Create a new project
    public entry fun create_project(
        account: &signer,
        title: String,
        description: String,
        goal: u64
    ) acquires GlobalProjectCollection {
        let creator_address = signer::address_of(account);
        let global_address = Global_Project_List;

        assert!(exists<GlobalProjectCollection>(global_address), ERR_NO_PROJECTS);

        let collection_ref = borrow_global_mut<GlobalProjectCollection>(global_address);

        let project_id = collection_ref.last_project_id + 1;

        let new_project = Project {
            id: project_id,
            creator: creator_address,
            title: title,
            description: description,
            goal: goal,
            total_funds_raised: 0,
        };

        vector::push_back(&mut collection_ref.projects, new_project);
        collection_ref.last_project_id = project_id;
    }

    // Back a project by contributing funds (APT tokens)
    public entry fun back_project(
        account: &signer,
        project_id: u64,
        amount: u64
    ) acquires GlobalProjectCollection {
        let backer_address = signer::address_of(account);
        let global_address = Global_Project_List;

        assert!(exists<GlobalProjectCollection>(global_address), ERR_NO_PROJECTS);

        let collection_ref = borrow_global_mut<GlobalProjectCollection>(global_address);
        let projects_len = vector::length(&collection_ref.projects);
        let i = 0;

        while (i < projects_len) {
            let project_ref = vector::borrow_mut(&mut collection_ref.projects, i);
            if (project_ref.id == project_id) {
                // Transfer the funds directly to the creator's address
                transfer<AptosCoin>(account, project_ref.creator, amount);

                // Update the total funds raised for viewing purposes
                project_ref.total_funds_raised = project_ref.total_funds_raised + amount;

                // Record the donation
                let donation = Donation {
                    backer: backer_address,
                    project_id: project_id,
                    amount: amount,
                    timestamp: timestamp::now_seconds(),
                };
                vector::push_back(&mut collection_ref.donations, donation);

                return
            };
            i = i + 1;
        };
        abort(ERR_PROJECT_NOT_FOUND)
    }

    // View all projects
    #[view]
    public fun view_all_projects(): vector<Project> acquires GlobalProjectCollection {
        let global_address = Global_Project_List;
        assert!(exists<GlobalProjectCollection>(global_address), ERR_NO_PROJECTS);

        let collection_ref = borrow_global<GlobalProjectCollection>(global_address);
        collection_ref.projects
    }

    // View project details by project ID
    #[view]
    public fun view_project_by_id(project_id: u64): Project acquires GlobalProjectCollection {
        let global_address = Global_Project_List;
        assert!(exists<GlobalProjectCollection>(global_address), ERR_NO_PROJECTS);

        let collection_ref = borrow_global<GlobalProjectCollection>(global_address);
        let projects_len = vector::length(&collection_ref.projects);
        let i = 0;

        while (i < projects_len) {
            let project_ref = vector::borrow(&collection_ref.projects, i);
            if (project_ref.id == project_id) {
                return *project_ref
            };
            i = i + 1;
        };
        abort(ERR_PROJECT_NOT_FOUND)
    }

    // View all campaigns created by a specific creator
    #[view]
    public fun view_projects_by_creator(creator: address): vector<Project> acquires GlobalProjectCollection {
        let global_address = Global_Project_List;
        assert!(exists<GlobalProjectCollection>(global_address), ERR_NO_PROJECTS);

        let collection_ref = borrow_global<GlobalProjectCollection>(global_address);
        let result = vector::empty<Project>();

        let projects_len = vector::length(&collection_ref.projects);
        let i = 0;

        while (i < projects_len) {
            let project_ref = vector::borrow(&collection_ref.projects, i);
            if (project_ref.creator == creator) {
                vector::push_back(&mut result, *project_ref);
            };
            i = i + 1;
        };
        result
    }

    // View all donations made by a specific address (backer)
    #[view]
    public fun view_donations_by_backer(backer: address): vector<Donation> acquires GlobalProjectCollection {
        let global_address = Global_Project_List;
        assert!(exists<GlobalProjectCollection>(global_address), ERR_NO_PROJECTS);

        let collection_ref = borrow_global<GlobalProjectCollection>(global_address);
        let result = vector::empty<Donation>();

        let donations_len = vector::length(&collection_ref.donations);
        let i = 0;

        while (i < donations_len) {
            let donation_ref = vector::borrow(&collection_ref.donations, i);
            if (donation_ref.backer == backer) {
                vector::push_back(&mut result, *donation_ref);
            };
            i = i + 1;
        };
        result
    }
}
