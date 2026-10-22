import { describe, it, expect } from 'vitest';
import { filterJobs, formatPostedDate, getDepartments, getLocations, sortByNewest } from './jobs';
import type { Job } from '../types/job';

function makeJob(slug: string, postedDate: string, overrides: Partial<Job> = {}): Job {
    return {
        slug,
        title: `Role ${slug}`,
        department: 'Technology',
        location: 'Remote',
        type: 'Full-time',
        remote: true,
        postedDate,
        summary: 'A role.',
        ...overrides,
    };
}

describe('sortByNewest', () => {
    it('orders jobs by posted date, newest first', () => {
        const jobs = [
            makeJob('a', '2027-01-01'),
            makeJob('b', '2027-03-15'),
            makeJob('c', '2027-02-10'),
        ];
        expect(sortByNewest(jobs).map((j) => j.slug)).toEqual(['b', 'c', 'a']);
    });

    it('does not mutate the input array', () => {
        const jobs = [makeJob('a', '2027-01-01'), makeJob('b', '2027-03-15')];
        const original = jobs.map((j) => j.slug);
        sortByNewest(jobs);
        expect(jobs.map((j) => j.slug)).toEqual(original);
    });
});

describe('formatPostedDate', () => {
    it('formats an ISO date as a readable string', () => {
        expect(formatPostedDate('2027-01-05')).toBe('January 5, 2027');
    });

    it('returns the raw value when the date is unparseable', () => {
        expect(formatPostedDate('not-a-date')).toBe('not-a-date');
    });
});

describe('role filtering', () => {
    const jobs = [
        makeJob('frontend', '2027-01-01', {
            department: 'Technology',
            location: 'Remote',
        }),
        makeJob('data', '2027-01-02', {
            department: 'Technology',
            location: 'Chicago',
        }),
        makeJob('finance', '2027-01-03', {
            department: 'Finance',
            location: 'Chicago',
        }),
    ];

    it('derives unique department and location options in alphabetical order', () => {
        expect(getDepartments(jobs)).toEqual(['Finance', 'Technology']);
        expect(getLocations(jobs)).toEqual(['Chicago', 'Remote']);
    });

    it('filters by department', () => {
        expect(filterJobs(jobs, { department: 'Technology' }).map((job) => job.slug)).toEqual([
            'frontend',
            'data',
        ]);
    });

    it('filters by location', () => {
        expect(filterJobs(jobs, { location: 'Chicago' }).map((job) => job.slug)).toEqual([
            'data',
            'finance',
        ]);
    });

    it('requires jobs to match both department and location filters', () => {
        expect(
            filterJobs(jobs, { department: 'Technology', location: 'Chicago' }).map(
                (job) => job.slug,
            ),
        ).toEqual(['data']);
    });

    it('returns no jobs for unmatched filter values', () => {
        expect(filterJobs(jobs, { department: 'Finance', location: 'Remote' })).toEqual([]);
    });

    it('returns all jobs when filters are cleared without mutating the input', () => {
        const original = [...jobs];

        expect(filterJobs(jobs, { department: '', location: '' })).toEqual(jobs);
        expect(jobs).toEqual(original);
    });
});
