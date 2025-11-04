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
    int numbers[3] = {10, 20, 30};

    for (int i = 0; i <= 3; i++) {
        cout << numbers[i] << endl;
    }

    return 0;
}
`,
      expectedOutput: ['10', '20', '30'], // Make it an array
    },
    {
      id: 2,
      title: 'Problem #2',
      code: `#include <iostream>
using namespace std;

int main() {
    int grades[5];
    grades[0] = 90;
    grades[1] = 85;
    grades[2] = 88;

    cout << "Grade 4: " << grades[3] << endl;
    cout << "Grade 5: " << grades[4] << endl;

    return 0;
}
`,
      expectedOutput: ['Grade 4: 96', 'Grade 5: 94'], 
    },
    {
      id: 3,
      title: 'Problem #3',
      code: `#include <iostream>
using namespace std;

struct Student {
    string name;
    int age;
};

int main() {
    Student s1;
    s1.name = "Dylan";
    s1.age = 19;

    cout << s1->name << " is " << s1->age << " years old.";
    return 0;
}
`,
      expectedOutput: ['Dylan is 19 years old.'], 
    },
    {
      id: 4,
      title: 'Problem #4',
      code: `#include <iostream>
using namespace std;

struct Student {
    string name;
    int age;
};

int main() {
    Student students[1];

    students[1].name = "Anna";
    students[2].name = "Ben";

    cout << students[1].name << " and " << students[2].name;
    return 0;
}
`,
      expectedOutput: ['Anna and Ben'], 
    },
    {
      id: 5,
      title: 'Problem #5',
      code: `#include <iostream>
using namespace std;

struct Book {
    string title
    string author;
};

int main() {
    Book b1;
    b1.title = "1984";
    b1.author = "George Orwell";

    cout << b1.title << " by " << b1.author;
    return 0;
}
`,
      expectedOutput: ['1984 by George Orwell'], 
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
