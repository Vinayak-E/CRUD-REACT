

interface FormState {
    name?: string;
    email: string;
    password: string;
  }
  
  export const validateInput = (name: string, value: string, isRegister: boolean): string => {
    let error = '';
    
    if (name === 'name' && isRegister) {
      if (!value.trim()) error = 'Name is required';
      else if (value.length < 3) error = 'Name must be at least 3 characters';
    } else if (name === 'email') {
      if (!value.trim()) error = 'Email is required';
      else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value)) error = 'Invalid email address';
    } else if (name === 'password') {
      if (!value.trim()) error = 'Password is required';
      else if (value.length < 8) error = 'Password must be at least 8 characters';
    }
    
    return error;
  };
  
  export const validateForm = (formState: FormState, isRegister: boolean): Partial<FormState> => {
    const { name, email, password } = formState;
    const newErrors: Partial<FormState> = {};
  
    if (isRegister && !name) {
      newErrors.name = 'Name is required';
    }
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
  
    return newErrors;
  };

  export const validateName = (name: string): boolean => /^[A-Za-z\s]{2,}$/.test(name);

  export const validateEmail = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  