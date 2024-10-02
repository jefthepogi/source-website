import React, { useState } from 'react';
import { FiCopy } from 'react-icons/fi';

function CodeSnippetsPage() {
  const [copied, setCopied] = useState(null);

  const handleCopy = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000); // Reset copied state after 2 seconds
  };

  const codeSnippets = [
    {
      id: 1,
      title: 'Problem #1',
      code: `#include <iostream>
using namespace std;

int main() {
    int num1, num2, sum;
    
    sum = num1 + num2;

    cout << "The sum is: " << sum << endl;
    return 0;
}
`,
      expectedOutput: 'The sum is: 12', // Add expected output here
    },
    {
      id: 2,
      title: 'Problem #2',
      code: `#include <iostream>
using namespace std;

int main() {
    int age = 16;

    if (age < 18) {
        cout << "You are an adult." << endl;
    } else {
        cout << "You are a minor." << endl;
    }

    return 0;
}
`,
      expectedOutput: 'You are a minor.', // Add expected output here
    },
    {
      id: 3,
      title: 'Problem #3',
      code: `#include <iostream>
using namespace std;

int main() {
    int num = -5;

    if (num > 0) {
        cout << num << " is positive." << endl;
    } else if (num = 0) {
        cout << num << " is zero." << endl;
    } else {
        cout << num << " is negative." << endl;
    }

    return 0;
}
`,
      expectedOutput: '-5 is negative.', // Add expected output here
    },
  ];

  return (
    <div>
      {/* Header Section */}
      <div className="bg-[#087830] text-white padding py-12">
        <div className="flex justify-between items-center"> 
          <div>
            <h1 className="text-6xl font-bold">Coding Tutorial</h1>
          </div>
          <div>
            <p className="max-w-md text-xl italic text-end">
              Let's test your C++ knowledge!
            </p>
          </div>
        </div>
      </div>
      <div className='padding py-8'>
        <h1 className="text-xl my-12">Analyze and debug the provided C++ code snippets and produce the expected output. Use <a className="link link-success" href='https://www.onlinegdb.com/'>onlinegdb.com</a> to write your code. If you are done or need help, don't hesitate to ask the SOURCE officers.</h1>
        {codeSnippets.map((snippet) => (
          <div key={snippet.id} className="mb-8 bg-gray-100 p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">{snippet.title}</h2>
              <button
                onClick={() => handleCopy(snippet.code, snippet.id)}
                className="bg-[#087830] text-white py-2 px-4 rounded-md flex items-center gap-2"
              >
                <FiCopy /> {copied === snippet.id ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <pre className="bg-gray-900 text-white p-4 rounded-md overflow-auto">
              <code>{snippet.code}</code>
            </pre>
            <div className="mt-4">
              <h3 className="text-xl font-semibold py-3">Expected Output:</h3>
              <p className="bg-gray-900 text-white p-4 rounded-md overflow-auto">{snippet.expectedOutput}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CodeSnippetsPage;
