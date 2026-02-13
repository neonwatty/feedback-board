import { vi } from "vitest";

interface MockResponse {
  data: unknown;
  error: unknown;
}

interface ChainableMock {
  select: ReturnType<typeof vi.fn>;
  insert: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
  eq: ReturnType<typeof vi.fn>;
  single: ReturnType<typeof vi.fn>;
  then: ReturnType<typeof vi.fn>;
}

export function createMockSupabase(overrides?: Partial<MockResponse>) {
  const response: MockResponse = {
    data: overrides?.data ?? null,
    error: overrides?.error ?? null,
  };

  const chainable: ChainableMock = {
    select: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    eq: vi.fn(),
    single: vi.fn(),
    then: vi.fn(),
  };

  // Make chainable thenable so it can be awaited as a terminal (like Supabase's query builder)
  chainable.then.mockImplementation((resolve: (v: MockResponse) => void) => Promise.resolve(response).then(resolve));

  // Each method returns chainable (for chaining) or resolves to response
  for (const key of Object.keys(chainable) as (keyof ChainableMock)[]) {
    if (key === "single") {
      chainable[key].mockResolvedValue(response);
    } else if (key === "then") {
      // already set up above
    } else {
      chainable[key].mockReturnValue(chainable);
    }
  }

  const from = vi.fn().mockReturnValue(chainable);

  const supabase = { from } as unknown;

  return { supabase: supabase as import("@supabase/supabase-js").SupabaseClient, from, chainable, response };
}

export function buildFormData(fields: Record<string, string>): FormData {
  const fd = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    fd.append(key, value);
  }
  return fd;
}
