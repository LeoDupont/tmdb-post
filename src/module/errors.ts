export module Errors {

	// Browser:
	export class BrowserNotLaunched extends Error {}
	export class BrowserNotConnected extends Error {}

	// Auth:
	export class LoginFailed extends Error {}
	export class AuthenticationRequired extends Error {}

	// TMDb:
	export class NotFound extends Error {}

}