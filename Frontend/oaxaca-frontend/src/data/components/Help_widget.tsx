import React, { useState } from "react";
import "../../css/Help_widget.css";

const HelpWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [tableNumber, setTableNumber] = useState("");
  const [issue, setIssue] = useState("");
  const [confirmation, setConfirmation] = useState(false);

  const togglePopup = () => {
    setIsOpen((prev) => !prev);
    setConfirmation(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: Replace with API call
    console.log("Table:", tableNumber);
    console.log("Issue:", issue);
    setTableNumber("");
    setIssue("");
    setConfirmation(true);
    setTimeout(() => {
      setIsOpen(false);
      setConfirmation(false);
    }, 3500);
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
              <button type="submit">Submit</button>
            </form>
          )}
        </div>
      )}
    </>
  );
};

export default HelpWidget;