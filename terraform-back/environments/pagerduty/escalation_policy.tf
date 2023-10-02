resource "pagerduty_escalation_policy" "devops" {
  name      = "Engineering Escalation Policy"
  num_loops = 2

  rule {
    escalation_delay_in_minutes = 10
    target {
      type = "user_reference"
      id   = data.pagerduty_user.chris_rose.id
    }
  }
}