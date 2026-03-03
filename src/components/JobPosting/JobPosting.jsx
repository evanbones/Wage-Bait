import React from "react";
import "./JobPosting.css";
import ActionButton from "../ActionButton/ActionButton.jsx";

function JobPosting({ title, company, wage }) {
    return (
        <div className="posting">
            <h2 className="title">{title}</h2>
            <p className="company">{company}</p>
            <p className="wage">{wage}</p>
            <ActionButton className="btn-register">Apply Now</ActionButton>
        </div>
    );
}

export default JobPosting;