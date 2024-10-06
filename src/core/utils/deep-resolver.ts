async function deepResolvePromises(input: any): Promise<any> {
    if (input instanceof Promise) {
      return await input;
    }
  
    if (Array.isArray(input)) {
      return await Promise.all(input.map(deepResolvePromises));
    }
  
    if (input instanceof Date) {
      return input;
    }
  
    if (typeof input === 'object' && input !== null) {
      const resolvedObject: Record<string, any> = {};
  
      for (const [key, value] of Object.entries(input)) {
        resolvedObject[key] = await deepResolvePromises(value);
      }
  
      return resolvedObject;
    }
  
    return input;
  }
  
export default deepResolvePromises;
  