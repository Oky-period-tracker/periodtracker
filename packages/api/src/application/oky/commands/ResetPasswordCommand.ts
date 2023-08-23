export interface ResetPasswordCommand {
  userName: string
  secretAnswer: string
  newPassword: string
}
