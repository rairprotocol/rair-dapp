locals {
  users = {
    brian_fogg = {
      email: "brian@rair.tech",
      allowed_IPs_v4: [
          # Tahoe base camp hotel lobby
          # (added: Monday Jan 31st, 2022)
          "172.58.35.83"
      ]
    }
  }
}