import React, { useState } from "react";
import "../../css/Help_widget.css";
import { createCallWaiterAlert } from "../../api/alertsApi";

const HelpWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [tableNumber, setTableNumber] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [issue, setIssue] = useState("");
  const [confirmation, setConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const togglePopup = () => {
    setIsOpen((prev) => !prev);
    setConfirmation(false);
    setSubmitError("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setSubmitError("");
    setIsSubmitting(true);

    try {
      await createCallWaiterAlert({
        tableNumber: Number(tableNumber),
        customerName: customerName.trim(),
        message: issue.trim(),
      });

      setTableNumber("");
      setCustomerName("");
      setIssue("");
      setConfirmation(true);
      setTimeout(() => {
        setIsOpen(false);
        setConfirmation(false);
      }, 3500);
    } catch {
      setSubmitError("Could not send your request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button className="help-button" onClick={togglePopup}>
        <img
          src="/images/main/help_widget.png"
          alt="Help"
          style={{ width: 90, height: 90, objectFit: 'contain' }}
        />
      </button>
      {isOpen && (
        <div className="popup">
          <button className="close-popup" onClick={togglePopup} aria-label="Close popup">&times;</button>
          {confirmation ? (
            <div className="confirmation-message">
              <p>Your request has been received by the waiter.<br />
              Please bear with us as we deal with your inquiry shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="tableNumber">Table Number:</label>
                <input
                  id="tableNumber"
                  type="number"
                  min={0}
                  max={10}
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  required
                  placeholder="Enter your table number"
                />
              </div>
              <div className="form-group">
                <label htmlFor="customerName">Name:</label>
                <input
                  id="customerName"
                  type="text"
                  value={customerName}
                  maxLength={50}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                  placeholder="Enter your name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="issue">Request:</label>
                <textarea
                  id="issue"
                  value={issue}
                  maxLength={100}
                  onChange={(e) => setIssue(e.target.value)}
                  required
                  placeholder="Describe your request or issue"
                />
                <p className="char_count">{issue.length} / 100 characters</p>
              </div>
              {submitError && <p className="char_count">{submitError}</p>}
              <button type="submit" disabled={isSubmitting}>{isSubmitting ? "Sending..." : "Submit"}</button>
            </form>
          )}
        </div>
      )}
    </>
  );
};

export default HelpWidget;