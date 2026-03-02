import React from "react";
import "./styles/JobPosting.css";

function JobPosting({ title, company, wage }) {
    return (
        <div className="posting">
            <p className="title">{title}</p>
            <p className="company">{company}</p>
            <p className="wage">{wage}</p>
        </div>
    );
}

export default JobPosting;