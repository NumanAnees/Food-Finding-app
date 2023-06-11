export const showSuccessMessage = (success) => (
  <div
    className="alert alert-success"
    style={{ "z-index": "1000", zIndex: "1000" }}
  >
    {success}
  </div>
);
export const showErrorMessage = (error) => (
  <div
    className="alert alert-danger"
    style={{ "z-index": "1000", zIndex: "1000" }}
  >
    {error}
  </div>
);
