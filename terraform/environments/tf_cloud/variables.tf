variable "tf_variable_types" {
  type = map(string)
  default = {
    ENV: "env",
    TERRAFORM: "terraform"
  }
}