import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Building2, DollarSign, ArrowRight } from "lucide-react";

function JobPosting({ id, title, company, salary, location, category, remote }) {
    return (
        <div className="group bg-brand-surface p-6 md:p-8 rounded-3xl border border-brand-secondary/10 hover:border-brand-accent hover:shadow-2xl hover:shadow-brand-primary/5 transition-all">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="bg-brand-background text-brand-secondary text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider">
                            {category || 'Other'}
                        </span>
                        {remote && (
                            <span className="bg-green-50 text-green-700 text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider">
                                Remote
                            </span>
                        )}
                    </div>
                    <Link to={`/jobs/${id}`} className="block group/title">
                        <h2 className="text-2xl font-serif text-brand-primary group-hover/title:text-brand-accent transition-colors leading-tight mb-2">
                            {title}
                        </h2>
                    </Link>
                    <div className="flex flex-wrap items-center gap-4 text-brand-secondary text-sm font-medium">
                        <div className="flex items-center gap-1.5">
                            <Building2 size={16} className="text-brand-accent/70" />
                            <span>{company}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <MapPin size={16} className="text-brand-accent/70" />
                            <span>{location}</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 border-t md:border-t-0 md:border-l border-brand-secondary/10 pt-4 md:pt-0 md:pl-8">
                    <div className="text-right">
                        <div className="text-xs text-brand-secondary uppercase font-bold tracking-widest mb-1">Salary</div>
                        <div className="text-xl font-bold text-brand-primary flex items-center gap-1">
                            <DollarSign size={18} className="text-brand-accent" />
                            {salary?.toLocaleString()}
                        </div>
                    </div>
                    <Link 
                        to={`/jobs/${id}`} 
                        className="bg-brand-primary text-brand-surface p-3 rounded-2xl hover:bg-brand-secondary transition-all transform hover:translate-x-1"
                    >
                        <ArrowRight size={20} />
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default JobPosting;
