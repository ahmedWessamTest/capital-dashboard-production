import { HttpInterceptorFn } from '@angular/common/http';

// Helper function to recursively remove null/undefined values from JSON objects
function cleanObject(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(item => cleanObject(item));
  } else if (obj !== null && typeof obj === 'object') {
    const cleanObj: any = {};
    for (const key of Object.keys(obj)) {
      const value = obj[key];
      if (value !== null && value !== undefined) {
        cleanObj[key] = cleanObject(value);
      }
    }
    return cleanObj;
  }
  return obj;
}

export const cleanBodyInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.body) {
    if (req.body instanceof FormData) {
      const cleanedFormData = new FormData();
      let modified = false;

      req.body.forEach((value, key) => {
        // Strip out null, undefined, or string representations of them
        if (value !== null && value !== undefined && value !== 'null' && value !== 'undefined') {
          cleanedFormData.append(key, value);
        } else {
          modified = true;
        }
      });

      if (modified) {
        const clonedReq = req.clone({ body: cleanedFormData });
        return next(clonedReq);
      }
    } else if (typeof req.body === 'object') {
      const cleanedBody = cleanObject(req.body);
      const clonedReq = req.clone({ body: cleanedBody });
      return next(clonedReq);
    }
  }

  return next(req);
};
