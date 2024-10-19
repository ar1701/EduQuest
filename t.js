let js =
{
  'title': 'MCQ Quiz on LinkedList',
  'questions': [
    {
      'question': 'Which of the following is the correct way to create a node in a singly linked list in Python?',
      'options': ['node = LinkedList()', 'node = ListNode()', 'node = Node()', 'node = newNode()'],
      'correctAnswer': 'node = Node()'
    },
    {
      'question': 'What is the time complexity of inserting a node at the beginning of a singly linked list?',
      'options': ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'],
      'correctAnswer': 'O(1)'
    },
    {
      'question': 'Which operation is not supported in a singly linked list?',
      'options': ['Insertion', 'Deletion', 'Searching', 'Updating'],
      'correctAnswer': 'Updating'
    },
    {
      'question': 'What is the difference between a singly linked list and a doubly linked list?',
      'options': ['Singly linked list has only forward pointers, while doubly linked list has both forward and backward pointers', 'Doubly linked list has only backward pointers, while singly linked list has both forward and backward pointers', 'Singly linked list is more efficient than doubly linked list', 'Doubly linked list is more efficient than singly linked list'],
      'correctAnswer': 'Singly linked list has only forward pointers, while doubly linked list has both forward and backward pointers'
    },
    {
      'question': 'What is the purpose of a head node in a linked list?',
      'options': ['To store the first node of the linked list', 'To store the last node of the linked list', 'To keep track of the length of the linked list', 'To mark the end of the linked list'],
      'correctAnswer': 'To store the first node of the linked list'
    },
    {
      'question': 'Which of the following is a valid way to traverse a linked list?',
      'options': ['While loop', 'For loop', 'Recursion', 'All of the above'],
      'correctAnswer': 'All of the above'
    },
    {
      'question': 'What is the time complexity of deleting a node from the middle of a singly linked list?',
      'options': ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'],
      'correctAnswer': 'O(n)'
    },
    {
      'question': 'Which of the following is an advantage of using a linked list over an array?',
      'options': ['Linked lists are more efficient for inserting and deleting elements', 'Linked lists can be used to represent complex data structures', 'Linked lists are more space-efficient than arrays', 'All of the above'],
      'correctAnswer': 'All of the above'
    },
    {
      'question': 'What is the purpose of a tail node in a linked list?',
      'options': ['To store the last node of the linked list', 'To store the first node of the linked list', 'To keep track of the length of the linked list', 'To mark the beginning of the linked list'],
      'correctAnswer': 'To store the last node of the linked list'
    },
    {
      'question': 'Which of the following is a disadvantage of using a linked list?',
      'options': ['Linked lists are less efficient for random access', 'Linked lists can be more complex to implement than arrays', 'Linked lists require more memory overhead than arrays', 'All of the above'],
      'correctAnswer': 'All of the above'
    },
    {
      'question': 'What is the best case time complexity for searching an element in a singly linked list?',
      'options': ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'],
      'correctAnswer': 'O(1)'
    },
    {
      'question': 'Which of the following is a type of linked list?',
      'options': ['Singly linked list', 'Doubly linked list', 'Circular linked list', 'All of the above'],
      'correctAnswer': 'All of the above'
    },
    {
      'question': 'What is the difference between a stack and a linked list?',
      'options': ['Stacks follow LIFO (Last In First Out) order, while linked lists follow FIFO (First In First Out) order', 'Linked lists follow LIFO (Last In First Out) order, while stacks follow FIFO (First In First Out) order', 'Stacks are implemented using arrays, while linked lists are implemented using pointers', 'Linked lists are implemented using arrays, while stacks are implemented using pointers'],
      'correctAnswer': 'Stacks follow LIFO (Last In First Out) order, while linked lists follow FIFO (First In First Out) order'
    },
    {
      'question': 'Which of the following is an application of linked lists?',
      'options': ['Implementing queues', 'Implementing stacks', 'Representing graphs', 'All of the above'],
      'correctAnswer': 'All of the above'
    },
    {
      'question': 'What is the time complexity of reversing a singly linked list?',
      'options': ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'],
      'correctAnswer': 'O(n)'
    }
  ]
}

console.log(js.questions[0].question);