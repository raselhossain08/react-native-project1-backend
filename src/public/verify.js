const messageTag = document.getElementById('message');

window.addEventListener("DOMContentLoaded", async () => {
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => {
            return searchParams.get(prop);
        }
    });

    const token = params.token;
    const id = params.id;

    try {
        const response = await fetch("/auth/verify", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ token, id })
        });

        if (!response.ok) {
            const { message } = await response.json();
            messageTag.innerText = message;
            messageTag.classList.add('error');
            return;
        }

        const { message } = await response.json();
        messageTag.innerText = message;
        messageTag.classList.remove('error');
        messageTag.classList.add('success');
    } catch (error) {
        messageTag.innerText = 'An error occurred. Please try again.';
        messageTag.classList.add('error');
    }
});
