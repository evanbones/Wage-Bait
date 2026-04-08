import React, { useState, useEffect } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumbs = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const pathnames = location.pathname.split('/').filter((x) => x);
  const [jobInfo, setJobInfo] = useState(null);
  const isAdminView = searchParams.get('isAdminView') === 'true';

  useEffect(() => {
    // check various sources for a jobId to fetch context
    const jobId = searchParams.get('jobId') || 
                  searchParams.get('fromJob') || 
                  (pathnames[0] === 'jobs' ? pathnames[1] : null) ||
                  (pathnames[0] === 'edit-job' ? pathnames[1] : null);
    
    if (jobId && jobId.length === 24) { // Basic MongoDB ObjectId length check
        fetch(`http://localhost:8000/api/jobs/${jobId}`)
            .then(res => res.json())
            .then(data => {
                if (data && data.title) {
                    setJobInfo(data);
                } else {
                    setJobInfo(null);
                }
            })
            .catch(() => setJobInfo(null));
    } else {
        setJobInfo(null);
    }
  }, [location.pathname, searchParams]);

  // don't show breadcrumbs on the home page
  if (location.pathname === '/') {
    return null;
  }

  const breadcrumbNameMap = {
    'login': 'Login',
    'register': 'Register',
    'search': 'Search Results',
    'jobs': 'Jobs',
    'profile': 'My Profile',
    'create-job': 'Post a Job',
    'edit-job': 'Edit Job',
    'admin': 'Admin',
    'admin-dashboard': 'Admin Dashboard',
    'my-postings': 'My Postings',
    'my-applications': 'My Applications',
    'user': 'Users'
  };

  const renderBreadcrumbs = () => {
    const items = [];
    
    // Always start with Home
    items.push(
      <li key="home">
        <Link 
          to="/" 
          className="text-brand-secondary hover:text-brand-primary transition-colors flex items-center gap-1"
        >
          <Home size={14} />
          <span>Home</span>
        </Link>
      </li>
    );

    // contextual stacking for User Profiles
    if (pathnames[0] === 'user') {
        if (isAdminView) {
            items.push(
                <li key="admin-context" className="flex items-center space-x-2">
                    <ChevronRight size={14} className="text-brand-secondary/40" />
                    <Link to="/admin-dashboard" className="text-brand-secondary hover:text-brand-primary transition-colors">
                        Admin Dashboard
                    </Link>
                </li>
            );
        } else if (jobInfo) {
            // add search results
            items.push(
                <li key="search-context" className="flex items-center space-x-2">
                    <ChevronRight size={14} className="text-brand-secondary/40" />
                    <Link to="/search" className="text-brand-secondary hover:text-brand-primary transition-colors">
                        Search Results
                    </Link>
                </li>
            );
            // add job title - link back to search page with this job selected
            items.push(
                <li key="job-context" className="flex items-center space-x-2">
                    <ChevronRight size={14} className="text-brand-secondary/40" />
                    <Link to={`/search?jobId=${jobInfo._id}`} className="text-brand-secondary hover:text-brand-primary transition-colors">
                        {jobInfo.title}
                    </Link>
                </li>
            );
        }
        
        // add username (last item)
        items.push(
            <li key="user-context" className="flex items-center space-x-2">
                <ChevronRight size={14} className="text-brand-secondary/40" />
                <span className="text-brand-primary font-bold">
                    {pathnames[1]}'s Profile
                </span>
            </li>
        );
        return items;
    }

    // Special handling for search results with job context
    if (pathnames[0] === 'search' || (pathnames[0] === 'jobs' && isAdminView)) {
        if (isAdminView) {
            items.push(
                <li key="admin-context" className="flex items-center space-x-2">
                    <ChevronRight size={14} className="text-brand-secondary/40" />
                    <Link to="/admin-dashboard" className="text-brand-secondary hover:text-brand-primary transition-colors">
                        Admin Dashboard
                    </Link>
                </li>
            );
        } else {
            items.push(
                <li key="search" className="flex items-center space-x-2">
                <ChevronRight size={14} className="text-brand-secondary/40" />
                {jobInfo ? (
                    <Link to="/search" className="text-brand-secondary hover:text-brand-primary transition-colors">
                    Search Results
                    </Link>
                ) : (
                    <span className="text-brand-primary font-bold">Search Results</span>
                )}
                </li>
            );
        }

        if (jobInfo) {
            items.push(
            <li key="job-details" className="flex items-center space-x-2">
                <ChevronRight size={14} className="text-brand-secondary/40" />
                <span className="text-brand-primary font-bold">
                {jobInfo.title} {jobInfo.location && `(${jobInfo.location})`}
                </span>
            </li>
            );
        }
        return items;
    }

    // standard path-based breadcrumbs
    pathnames.forEach((value, index) => {
        const last = index === pathnames.length - 1;
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        
        let displayName = breadcrumbNameMap[value] || value;
        let linkTo = to;
        
        // if the path segment is 'jobs', redirect it to 'Search Results'
        if (value === 'jobs') {
            displayName = 'Search Results';
            linkTo = '/search';
        }

        // Logical "stacking" for profile pages
        if ((value === 'my-postings' || value === 'my-applications') && index === 0) {
            items.push(
                <li key="profile-parent" className="flex items-center space-x-2">
                    <ChevronRight size={14} className="text-brand-secondary/40" />
                    <Link to="/profile" className="text-brand-secondary hover:text-brand-primary transition-colors">
                        My Profile
                    </Link>
                </li>
            );
        }

        // Handle dynamic job details
        if (pathnames[index - 1] === 'jobs' || pathnames[index - 1] === 'edit-job') {
            if (jobInfo) {
                displayName = `${jobInfo.title} ${jobInfo.location ? `(${jobInfo.location})` : ''}`;
            } else {
                displayName = 'Details';
            }
        }

        items.push(
          <li key={to} className="flex items-center space-x-2">
            <ChevronRight size={14} className="text-brand-secondary/40" />
            {last ? (
              <span className="text-brand-primary font-bold">{displayName}</span>
            ) : (
              <Link 
                to={linkTo} 
                className="text-brand-secondary hover:text-brand-primary transition-colors"
              >
                {displayName}
              </Link>
            )}
          </li>
        );
    });

    return items;
  };

  return (
    <nav aria-label="Breadcrumb" className="bg-brand-background/50 border-b border-brand-secondary/5 py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ol className="flex items-center space-x-2 text-sm font-medium">
          {renderBreadcrumbs()}
        </ol>
      </div>
    </nav>
  );
};

export default Breadcrumbs;
