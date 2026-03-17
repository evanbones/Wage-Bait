import React from "react";
import { Link } from "react-router-dom";
import "./JobPosting.css";

function JobPosting({ id, title, company, wage }) {
    return (
        <div className="posting">
            <Link to={`/jobs/${id}`} className="job-link">
                <h2 className="title">{title}</h2>
            </Link>
            <p className="company">{company}</p>
            <p className="wage">{wage}</p>
            <Link to={`/jobs/${id}`} className="apply-link">
                <button className="btn-apply">View Details</button>
            </Link>
        </div>
    );
}

export default JobPosting;
