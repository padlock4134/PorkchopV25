import React from 'react';
import Link from 'next/link';

export default function TestDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Test Dashboard Page</h1>
      <p className="mb-4">If you can see this, routing to dashboard pages is working correctly.</p>
      <p className="mb-4">The issue might be with the actual dashboard component.</p>
      
      <div className="flex space-x-4">
        <Link href="/dashboard" className="px-4 py-2 bg-butcher-600 text-white rounded">
          Try Real Dashboard
        </Link>
        <Link href="/" className="px-4 py-2 bg-gray-600 text-white rounded">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
