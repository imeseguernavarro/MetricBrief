export default {
    content: ["./index.html", "./src/**/*.{ts,tsx}"],
    theme: {
        extend: {
            colors: {
                ink: "#101217",
                cloud: "#f5f7fb",
                line: "#e4e8f0",
                violet: "#7c3aed",
                coral: "#ff5a66",
                mint: "#2bc48a",
                sky: "#2388ff",
                amber: "#f5a524"
            },
            boxShadow: {
                soft: "0 18px 50px rgba(16, 18, 23, 0.08)",
                crisp: "0 1px 0 rgba(16, 18, 23, 0.06), 0 12px 30px rgba(16, 18, 23, 0.06)"
            }
        },
    },
    plugins: [],
};
