const TextField = ({
    label, id, type, errors, register,
    required, message, className, min, value, placeholder,
}) => {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label
                htmlFor={id}
                style={{ color: "var(--txt-label)", fontSize: "13px", fontWeight: 600 }}
            >
                {label}
            </label>

            <input
                type={type}
                id={id}
                placeholder={placeholder}
                style={{
                    background: "var(--bg-input)",
                    color: "var(--txt-input)",
                    border: `1px solid ${errors[id]?.message ? "#e24b4a" : "var(--border-input)"}`,
                    borderRadius: "8px",
                    padding: "10px 14px",
                    fontSize: "14px",
                    outline: "none",
                    width: "100%",
                    boxSizing: "border-box",
                }}
                {...register(id, {
                    required: { value: required, message },
                    minLength: min ? { value: min, message: "Minimum 6 characters required" } : null,
                    pattern:
                        type === "email"
                            ? { value: /^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+com+$/, message: "Invalid email" }
                            : type === "url"
                            ? { value: /^(https?:\/\/)?(([a-zA-Z0-9\u00a1-\uffff-]+\.)+[a-zA-Z\u00a1-\uffff]{2,})(:\d{2,5})?(\/[^\s]*)?$/, message: "Please enter a valid URL" }
                            : null,
                })}
            />

            {errors[id]?.message && (
                <p style={{ color: "#e24b4a", fontSize: "12px", fontWeight: 600, margin: 0 }}>
                    {errors[id]?.message}
                </p>
            )}
        </div>
    );
};

export default TextField;
