import { useEffect, useState } from "react";

import PropTypes from "prop-types";

const Setting = ({ modalOpen, setModalOpen }) => {
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [username, setUsername] = useState("");
    const [psw, setPsw] = useState("");

    const loginToAWS = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg("");

        await fetch("https://cognito-idp.us-east-1.amazonaws.com/", {
            method: "POST",
            headers: {
                Accept: "*/*",
                "Content-Type": "application/x-amz-json-1.1",
                "X-Amz-Target":
                    "AWSCognitoIdentityProviderService.InitiateAuth",
            },
            body: JSON.stringify({
                AuthFlow: "USER_PASSWORD_AUTH",
                ClientId: "eclutjrn1sit6reqlb808iha",
                AuthParameters: {
                    USERNAME: username,
                    PASSWORD: psw,
                },
            }),
        })
            .then((res) => {
                return res.json();
            })
            .then((content) => {
                const { AuthenticationResult } = content;
                const { IdToken } = AuthenticationResult;
                localStorage.setItem("token", JSON.stringify(IdToken));
                console.log("works");
                setModalOpen(false);
            })
            .catch(() => {
                console.log("doesnt work");
                setErrorMsg("error: login fail, check credentials");
                setModalOpen(true);
                localStorage.setItem("token", null);
            });

        setLoading(false);
    };

    // useEffect(() => {
    //     if (modalOpen) {
    //         setPsw(token);
    //     }
    // }, [token, modalOpen]);

    return (
        <form
            onSubmit={loginToAWS}
            className="flex flex-col items-center justify-center gap-2"
        >
            <label htmlFor="username">Username:</label>
            <input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                type="text"
                className="w-full max-w-xs input input-bordered"
            />
            <label htmlFor="psw">Password:</label>
            <input
                id="psw"
                value={psw}
                onChange={(e) => setPsw(e.target.value)}
                type="password"
                className="w-full max-w-xs input input-bordered"
            />
            <button
                disabled={loading}
                className="w-full max-w-xs btn btn-outline"
            >
                {loading ? (
                    <>
                        <span className="loading loading-spinner" />
                        <p>Checking...</p>
                    </>
                ) : (
                    "Login"
                )}
            </button>
            <p>{errorMsg}</p>
        </form>
    );
};

export default Setting;

Setting.propTypes = {
    modalOpen: PropTypes.bool.isRequired,
    setModalOpen: PropTypes.func.isRequired,
};
