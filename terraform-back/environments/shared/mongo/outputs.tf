output "db_users" {
  value = {
    garrett: {
      username: "garrett"
    },
    brian: {
      username: "brian"
    },
    chris: {
      username: "chris"
    },
    zeph: {
      username: "zeph"
    },
    masha: {
      username: "masha"
    }
  }
}

output "mongo_project_id_map" {
  value = {
    dev: {
      project_id: "625748389ff82f22f1cdb6b5"
    },
    staging: {
      project_id: "62575848c9fa204e83bb67a1"
    },
    prod: {
      project_id: "6257593b28500970d4cc2efb"
    }
  }
}

# As per this document
# https://www.mongodb.com/docs/atlas/reference/google-gcp/
output "gcp_region_map" {
  value = {
    # Iowa, USA
    us-central1: "CENTRAL_US",

    # South Carolina, USA
    us-east1: "EASTERN_US",
    
    # North Virginia, USA
    us-east4: "US_EAST_4",
    
    # Montreal, Canada
    northamerica-northeast1: "NORTH_AMERICA_NORTHEAST_1",
    
    # Toronto, Canada
    northamerica-northeast2: "NORTH_AMERICA_NORTHEAST_2",
    
    # Sao Paulo, Brazil
    southamerica-east1: "SOUTH_AMERICA_EAST_1",
    
    # Oregon, USA
    us-west1: "WESTERN_US",
    
    # Los Angeles, CA, USA
    us-west2: "US_WEST_2",
    
    # Salt Lake City, UT, USA
    us-west3: "US-WEST_3",
    
    # Las Vegas, NV, USA
    us-west4: "US-WEST_4"
  }
}

output "gcp_provider_name" {
  value = "GCP"
}

output "cluster_type_map" {
  value = {
    REPLICASET: "REPLICASET",
    SHARDED: "SHARDED",
    GEOSHARDED: "GEOSHARDED"
  }
}

output "version_release_system_map" {
  value = {
    CONTINUOUS: "CONTINUOUS",
    LTS: "LTS"
  }
}

output "instance_size_map" {
  value = {
    M10: {
      name: "M10"
    },
    # Defautl storage: 10 GB
    # Default ram: 1.7 GB
  }
}

# Built in roles used in MongoDB as per this document
# https://www.mongodb.com/docs/manual/reference/built-in-roles/
output "built_in_roles_map" {
  value = {
    read: "read",
    readWrite: "readWrite",
    dbAdmin: "dbAdmin",
    dbOwner: "dbOwner",
    userAdmin: "userAdmin",
    clusterAdmin: "clusterAdmin",
    clusterManager: "clusterManager",
    clusterMonitor: "clusterMonitor",
    hostManager: "hostManager",
    backup: "backup",
    restore: "restore",
    readAnyDatabase: "readAnyDatabase",
    readWriteAnyDatabase: "readWriteAnyDatabase",
    userAdminAnyDatabase: "userAdminAnyDatabase",
    dbAdminAnyDatabase: "dbAdminAnyDatabase",
    root: "root",
  }
}

output "X509Type" {
  value = {
    NONE: "NONE",
    MANAGED: "MANAGED",
    CUSTOMER: "CUSTOMER"
  }
}

# NEVER CHANGE THIS
output "mongo_admin_db_name" {
  value = "admin"
}

# NEVER CHANGE THIS
output "mongo_external_db_name" {
  value = "$external"
}

# NEVER CHANGE THIS
output "initial_db_user_password_before_manual_reset" {
  value = "change_me_in_dashboard_after_TF_apply"
}