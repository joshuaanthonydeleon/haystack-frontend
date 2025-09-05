# Claude Code Style Rules for Haystack FI

## Function Declaration Rules

### ✅ ALWAYS USE: Arrow Function Syntax
```typescript
// ✅ Correct - Use this pattern
const functionName = () => {
  // function body
}

const functionName = (param1: string, param2: number) => {
  // function body
}

const functionName = async (param: string): Promise<void> => {
  // async function body
}
```

### ❌ NEVER USE: Traditional Function Declarations
```typescript
// ❌ Incorrect - Do NOT use this pattern
function functionName() {
  // function body
}

function functionName(param1: string, param2: number) {
  // function body
}

async function functionName(param: string): Promise<void> {
  // async function body
}
```

## Specific Rules

1. **Component Functions**: Always use arrow functions for React components
   ```typescript
   // ✅ Correct
   const MyComponent = () => {
     return <div>Hello</div>
   }
   
   // ❌ Incorrect
   function MyComponent() {
     return <div>Hello</div>
   }
   ```

2. **Event Handlers**: Always use arrow functions
   ```typescript
   // ✅ Correct
   const handleClick = () => {
     console.log('clicked')
   }
   
   // ❌ Incorrect
   function handleClick() {
     console.log('clicked')
   }
   ```

3. **Utility Functions**: Always use arrow functions
   ```typescript
   // ✅ Correct
   const calculateTotal = (items: Item[]) => {
     return items.reduce((sum, item) => sum + item.price, 0)
   }
   
   // ❌ Incorrect
   function calculateTotal(items: Item[]) {
     return items.reduce((sum, item) => sum + item.price, 0)
   }
   ```

4. **API Functions**: Always use arrow functions
   ```typescript
   // ✅ Correct
   const fetchUserData = async (userId: string): Promise<User> => {
     const response = await fetch(`/api/users/${userId}`)
     return response.json()
   }
   
   // ❌ Incorrect
   async function fetchUserData(userId: string): Promise<User> {
     const response = await fetch(`/api/users/${userId}`)
     return response.json()
   }
   ```

## Enforcement Instructions for Claude

**CRITICAL**: When writing ANY function in this codebase:

1. **Always check existing code patterns** - This codebase uses arrow function syntax exclusively
2. **Never write `function functionName()`** - Always use `const functionName = () =>`
3. **Apply to all contexts**: Components, handlers, utilities, API calls, helpers, etc.
4. **Include proper TypeScript types** when using arrow functions
5. **Maintain consistency** - If you see traditional function syntax, convert it to arrow function syntax

## Examples in Context

### React Components
```typescript
// ✅ Route Components
export const Route = createFileRoute('/dashboard')({
  component: DashboardComponent,
})

const DashboardComponent = () => {
  return <div>Dashboard</div>
}

// ✅ Sub-components
const HeaderSection = ({ title }: { title: string }) => {
  return <h1>{title}</h1>
}
```

### Event Handlers
```typescript
const SignInForm = () => {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // handle form submission
  }

  const handleInputChange = (value: string) => {
    // handle input change
  }

  return <form onSubmit={handleSubmit}>...</form>
}
```

### API Services
```typescript
const apiService = {
  signIn: async (credentials: AuthRequest): Promise<AuthResponse> => {
    // API logic
  },
  
  fetchVendors: async (): Promise<Vendor[]> => {
    // API logic
  }
}
```

## Rationale

1. **Consistency**: Maintains uniform code style throughout the codebase
2. **Modern ES6+**: Arrow functions are the modern JavaScript/TypeScript standard
3. **Lexical `this` binding**: Arrow functions handle `this` context more predictably
4. **Brevity**: More concise syntax for function expressions
5. **Team standards**: Aligns with established project conventions

---

**Claude**: Always follow these rules when writing or modifying functions in this codebase. No exceptions.