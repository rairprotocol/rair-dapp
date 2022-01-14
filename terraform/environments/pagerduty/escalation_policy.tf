resource "pagerduty_escalation_policy" "engineering" {
  name      = "Engineering Escalation Policy"
  num_loops = 2

  rule {
    escalation_delay_in_minutes = 10
  }
}