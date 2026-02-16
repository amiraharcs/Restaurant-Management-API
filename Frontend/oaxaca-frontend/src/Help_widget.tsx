import React, { useState } from "react";
import "./help_widget.css";

const Help_widget: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggle_Popup = () => {
    setIsOpen(!isOpen);
  };

  const [ table_number, set_table_number] = useState<string>("");
  const [ issue, set_issue] = useState<string>("");

  const handle_submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("Table:", table_number);
    console.log("Issue:", issue);

    /* API placeholder here*/

    set_table_number("");
    set_issue("");

    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Button */}
      <button className="help-button" onClick={toggle_Popup}>
        ?
      </button>

      {/* Popup */}
      {isOpen && (
        <div className="popup">
          <form onSubmit={handle_submit}>
            
            {/* Table Number Field */}
            <div className="form-group">
              <label htmlFor="tableNumber">Table Number</label>
              <input
                id="tableNumber"
                type="number"
                min={0}
                max={30}
                value={table_number}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  set_table_number(e.target.value)
                }
                required
              />
            </div>

            {/* Issue Field */}
            <div className="form-group">
              <label htmlFor="issue">Issue</label>
              <textarea
                id="issue"
                value={issue}
                maxLength={100}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  set_issue(e.target.value)
                }
                required
              />
              <p className="char_count">
                {issue.length} / 100 characters
              </p>
            </div>

            <button type="submit">Submit</button>
          </form>
        </div>
      )}
    </>
  );
};
            

export default Help_widget