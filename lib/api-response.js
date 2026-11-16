import { NextResponse } from 'next/server';

/**
 * Standard API response helper for consistent shape across all endpoints
 */
export function successResponse(data = null, meta = null, status = 200) {
  return NextResponse.json(
    {
      success: true,
      data,
      error: null,
      meta,
    },
    { status }
  );
}

export function errorResponse(errorMessage = 'An unexpected error occurred', status = 400, errors = null) {
  return NextResponse.json(
    {
      success: false,
      data: null,
      error: errorMessage,
      meta: errors ? { errors } : null,
    },
    { status }
  );
}
