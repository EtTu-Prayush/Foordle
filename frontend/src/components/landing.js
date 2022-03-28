import ls from "local-storage";

return (
  <h3>
    Hello {ls.get("username")}. You are a {ls.get("user_type")}
  </h3>
);

export default Welcome;
