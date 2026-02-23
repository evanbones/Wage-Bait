function JobPosting({ title, company, wage }) {
    return (
        <div className="posting" style={{
            border: "2px solid black",
            padding: "10px",
            margin: "10px 0",
            borderRadius: "8px"
            }}>
            <p className="title">{title}</p>
            <p className="company">{company}</p>
            <p className="wage">{wage}</p>
        </div>
    );
}

export default JobPosting;