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
    int pi = 3.14;
    cout << "Pi is: " << pi;
    return 0;
}
`,
      expectedOutput: ['Pi is: 3.14'], // Make it an array
    },
    {
      id: 2,
      title: 'Problem #2',
      code: `#include <iostream>
using namespace std;

int main() {
    int x = 5;
    if (x = 10) {
        cout << "x is 10";
    } else {
        cout << "x is not 10";
    }
    return 0;
}
`,
      expectedOutput: ['x is not 10'], // Make it an array
    },
    {
      id: 3,
      title: 'Problem #3',
      code: `#include <iostream>
using namespace std;

int main() {
    int num = -5;
    if (num > 0) {
        cout << "Number is negative";
    } else {
        cout << "Number is positive";
    }
    return 0;
}
`,
      expectedOutput: ['Number is negative'], // Make it an array
    },
    {
      id: 4,
      title: 'Problem #4',
      code: `#include <iostream>
using namespace std;

int main() {
    int x = 10
    cout << "The value of x is: " << x;
    return 0;
}
`,
      expectedOutput: ['The value of x is: 10'], // Make it an array
    },
    {
      id: 5,
      title: 'Problem #5',
      code: `#include <iostream>
using namespace std;

int main() {
    int number;
    if (number % 2 == 0) {
        cout << "Even number";
    } else {
        cout << "Odd number";
    }
    return 0;
}
`,
      expectedOutput: ['Even number'], // Make it an array
    },
  ];

  return (
    <div>
      {/* Header Section */}
      <div className="bg-[#087830] text-white padding py-12">
        <div className="flex justify-between items-center"> 
          <div>
            <h1 className="text-6xl font-bold">Programming Bootcamp</h1>
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
              <div className="bg-gray-900 text-white p-4 rounded-md overflow-auto">
                {snippet.expectedOutput.map((line, index) => (
                  <p key={index}>{line}</p> // Render each line in a separate paragraph
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CodeSnippetsPage;
