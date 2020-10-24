import React from "react";
import { providers, csrfToken, signIn } from "next-auth/client";

export default function SignIn({ providers, callbackUrl, email }) {
  let error = null;
  let errorMessage;
  if (error) {
    switch (error) {
      case "Signin":
      case "OAuthSignin":
      case "OAuthCallback":
      case "OAuthCreateAccount":
      case "EmailCreateAccount":
      case "Callback":
        errorMessage = <p>Try signing with a different account.</p>;
        break;
      case "OAuthAccountNotLinked":
        errorMessage = (
          <p>
            To confirm your identity, sign in with the same account you used
            originally.
          </p>
        );
        break;
      case "EmailSignin":
        errorMessage = <p>Check your email address.</p>;
        break;
      case "CredentialsSignin":
        errorMessage = (
          <p>Sign in failed. Check the details you provided are correct.</p>
        );
        break;
      default:
        errorMessage = <p>Unable to sign in.</p>;
        break;
    }
  }

  const providersToRender = Object.values(providers).filter((provider) => {
    if (provider.type === "oauth" || provider.type === "email") {
      // Always render oauth and email type providers
      return true;
    } else if (provider.type === "credentials" && provider.credentials) {
      // Only render credentials type provider if credentials are defined
      return true;
    } else {
      // Don't render other provider types
      return false;
    }
  });

  return (
    <>
      <div className="signin">
        <h1>Sign into Stupidfits!</h1>
        {errorMessage && <div className="error">{errorMessage}</div>}
        {providersToRender.map((provider, i) => (
          <div key={provider.id} className="provider">
            {provider.type === "oauth" && (
              <form action={provider.signinUrl} method="POST">
                {provider.preface && <p>{provider.preface}</p>}
                <input type="hidden" name="csrfToken" value={csrfToken} />
                {callbackUrl && (
                  <input type="hidden" name="callbackUrl" value={callbackUrl} />
                )}
                <button type="submit" className="button">
                  Sign in with {provider.name}
                </button>
              </form>
            )}
            {(provider.type === "email" || provider.type === "credentials") &&
              i > 0 &&
              providersToRender[i - 1].type !== "email" &&
              providersToRender[i - 1].type !== "credentials" && <hr />}
            {provider.type === "email" && (
              <form action={provider.signinUrl} method="POST">
                {provider.preface && <p>{provider.preface}</p>}
                <input type="hidden" name="csrfToken" value={csrfToken} />
                <label for={`input-email-for-${provider.id}-provider`}>
                  Email
                </label>
                <input
                  id={`input-email-for-${provider.id}-provider`}
                  autoFocus
                  type="text"
                  name="email"
                  value={email}
                  placeholder="email@example.com"
                />
                <button type="submit">Sign in with {provider.name}</button>
              </form>
            )}
            {provider.type === "credentials" && (
              <form action={provider.callbackUrl} method="POST">
                <input type="hidden" name="csrfToken" value={csrfToken} />
                {Object.keys(provider.credentials).map((credential) => {
                  return (
                    <div key={`input-group-${provider.id}`}>
                      <label
                        for={`input-${credential}-for-${provider.id}-provider`}
                      >
                        {provider.credentials[credential].label || credential}
                      </label>
                      <input
                        name={credential}
                        id={`input-${credential}-for-${provider.id}-provider`}
                        type={provider.credentials[credential].type || "text"}
                        value={provider.credentials[credential].value || ""}
                        placeholder={
                          provider.credentials[credential].placeholder || ""
                        }
                      />
                    </div>
                  );
                })}
                <button type="submit">Sign in with {provider.name}</button>
              </form>
            )}
            {(provider.type === "email" || provider.type === "credentials") &&
              i + 1 < providersToRender.length && <hr />}
          </div>
        ))}
      </div>
      {Object.values(providers).map((provider) => (
        <div key={provider.name}>
          <button onClick={() => signIn(provider.id)}>
            Sign in with {provider.name}
          </button>
        </div>
      ))}
    </>
  );
}

SignIn.getInitialProps = async (context) => {
  return {
    providers: await providers(context),
  };
};
