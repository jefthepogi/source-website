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
#include <string>
using namespace std;

int main() {
    string str = "Rohan";
    int n = str.length();
    
    for (int i = 0; i < n / 2; i++) {
        char temp = str[i];
        str[i] = str[n - i]; 
        str[n - i] = temp;
    }
    
    cout << str << endl;
    return 0;
}
`,
      expectedOutput: ['nahoR'], // Make it an array
    },
    {
      id: 2,
      title: 'Problem #2',
      code: `#include <iostream>
#include <string>
using namespace std;

int main() {
    string str1 = "Hello";
    string str2 = "Emoria";
    string result;
    
    result = str1 + str2;
    
    cout << result << endl;
    return 0;
}
`,
      expectedOutput: ['Hello Emoria'], // Make it an array
    },
    {
      id: 3,
      title: 'Problem #3',
      code: `#include <iostream>
#include <string>
using namespace std;

int main() {
    string str = "Rondina";
    char firstChar = str[0];
    
    cout << "First character: " << firstChar << endl;
    cout << "Last character: " << str[str.length()] << endl;
    return 0;
}
`,
      expectedOutput: [
        'First character: R',
        'Last character: a',
      ], // Make it an array
    },
    {
      id: 4,
      title: 'Problem #4',
      code: `#include <iostream>
#include <string>
using namespace std;

int main() {
    string str = "justin aeron";
    int count = 0;

    for (int i = 0; i <= str.length(); i++) {
        if (str[i] == ' ') {
            count += 10;
        }
    }

    cout << "Number of characters: " << count << endl;
    return 0;
}
`,
      expectedOutput: ['Number of characters: 11'], // Make it an array
    },
    {
      id: 5,
      title: 'Problem #5',
      code: `#include <iostream>
#include <string>
using namespace std;

int main() {
    string str = "hello world";
    char oldChar = 'o';
    char newChar = 'a';

    for (int i = 0; i < str.length(); i++) {
        if (str[i] == oldChar) {
            str[i] == newChar;
            str[i] == ' ';
        }
    }

    cout << "Modified string: " << str << endl;
    return 0;
}
`,
      expectedOutput: ['Number of characters: 10'], // Make it an array
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
