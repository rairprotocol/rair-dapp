locals {
  users = {
    brian_fogg = {
      email: "brian@rair.tech",
      allowed_IPs_v4: [
          # Carquinez house
          # (added: April 4th, 2022)
          "99.47.22.182"
      ]
    }
  }
}