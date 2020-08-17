export module Errors {

	// Browser:
	export class BrowserNotLaunched extends Error { name = 'BrowserNotLaunched'; }
	export class BrowserNotConnected extends Error { name = 'BrowserNotConnected'; }

	// Auth:
	export class LoginFailed extends Error { name = 'LoginFailed'; }
	export class AuthenticationRequired extends Error { name = 'AuthenticationRequired'; }

	// TMDb:
	export class NotFound extends Error { name = 'NotFound'; }

}