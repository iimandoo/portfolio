# Execute (실행 단계) - Next.js 16

**분석과 계획을 바탕으로 실제 구현을 진행합니다.**

## Rules

- ✅ **이제 코드를 수정해도 됩니다**
- ✅ 중간에 멈추지 말고 완료까지 진행
- ✅ 문제 발생 시에만 멈추고 보고
- ✅ 완료 후 요약 제공

## 코드 패턴

### 1. 타입 정의 (types/user.ts)
```typescript
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

export interface CreateUserInput {
  name: string;
  email: string;
}
```

### 2. Zod 스키마 (lib/validations/user.ts)
```typescript
import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().min(2, '이름은 2자 이상이어야 합니다'),
  email: z.string().email('올바른 이메일을 입력하세요'),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
```

### 3. TanStack Query - 조회 (hooks/queries/use-users.ts)
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { User, CreateUserInput } from '@/types/user';

// Query Keys (상수로 관리)
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: string) => [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
};

// 사용자 목록 조회
export function useUsers() {
  return useQuery({
    queryKey: userKeys.lists(),
    queryFn: async (): Promise<User[]> => {
      const res = await fetch('/api/users');
      if (!res.ok) throw new Error('Failed to fetch users');
      return res.json();
    },
  });
}

// 사용자 상세 조회
export function useUser(id: string) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: async (): Promise<User> => {
      const res = await fetch(`/api/users/${id}`);
      if (!res.ok) throw new Error('Failed to fetch user');
      return res.json();
    },
    enabled: !!id,
  });
}

// 사용자 생성
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateUserInput): Promise<User> => {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create user');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
}

// 사용자 삭제
export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete user');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
}
```

### 4. Zustand Store - UI 상태 (stores/use-ui-store.ts)
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  // Modal
  isCreateModalOpen: boolean;
  openCreateModal: () => void;
  closeCreateModal: () => void;

  // Sidebar
  isSidebarOpen: boolean;
  toggleSidebar: () => void;

  // Theme (persist)
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      // Modal
      isCreateModalOpen: false,
      openCreateModal: () => set({ isCreateModalOpen: true }),
      closeCreateModal: () => set({ isCreateModalOpen: false }),

      // Sidebar
      isSidebarOpen: true,
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

      // Theme
      theme: 'light',
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'ui-store',
      partialize: (state) => ({ theme: state.theme }), // theme만 persist
    }
  )
);
```

### 5. Zustand Store - 인증 (stores/use-auth-store.ts)
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    { name: 'auth-store' }
  )
);
```

### 6. Server Action (*.action.ts)
```typescript
'use server';

import { revalidatePath } from 'next/cache';
import { createUserSchema } from '@/lib/validations/user';

export type ActionState = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

export async function createUserAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const rawData = {
    name: formData.get('name'),
    email: formData.get('email'),
  };

  const validated = createUserSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors,
    };
  }

  try {
    await fetch(`${process.env.API_URL}/users`, {
      method: 'POST',
      body: JSON.stringify(validated.data),
    });

    revalidatePath('/users');
    return { success: true, message: '사용자가 생성되었습니다' };
  } catch (error) {
    return { success: false, message: '생성에 실패했습니다' };
  }
}
```

### 7. View 컴포넌트 (UI만)
```typescript
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface UserFormViewProps {
  isPending: boolean;
  errors?: Record<string, string[]>;
  onSubmit: (formData: FormData) => void;
}

export function UserFormView({ isPending, errors, onSubmit }: UserFormViewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>새 사용자</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">이름</Label>
            <Input id="name" name="name" placeholder="홍길동" />
            {errors?.name && (
              <p className="text-sm text-destructive">{errors.name[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">이메일</Label>
            <Input id="email" name="email" type="email" />
            {errors?.email && (
              <p className="text-sm text-destructive">{errors.email[0]}</p>
            )}
          </div>

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? '처리 중...' : '생성하기'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
```

### 8. Container 컴포넌트 (로직)
```typescript
'use client';

import { useActionState, useEffect } from 'react';
import { toast } from 'sonner';
import { createUserAction, type ActionState } from './user-form.action';
import { UserFormView } from './user-form';
import { useUIStore } from '@/stores/use-ui-store';

const initialState: ActionState = { success: false };

export function UserFormContainer() {
  const [state, formAction, isPending] = useActionState(createUserAction, initialState);
  const closeModal = useUIStore((state) => state.closeCreateModal);

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
      closeModal();
    } else if (state.message) {
      toast.error(state.message);
    }
  }, [state, closeModal]);

  return (
    <UserFormView
      isPending={isPending}
      errors={state.errors}
      onSubmit={formAction}
    />
  );
}
```

### 9. 리스트 Container (TanStack Query 사용)
```typescript
'use client';

import { useUsers, useDeleteUser } from '@/hooks/queries/use-users';
import { useUIStore } from '@/stores/use-ui-store';
import { UserListView } from './user-list';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

export function UserListContainer() {
  const { data: users, isLoading, error } = useUsers();
  const deleteUser = useDeleteUser();
  const openCreateModal = useUIStore((state) => state.openCreateModal);

  const handleDelete = async (id: string) => {
    try {
      await deleteUser.mutateAsync(id);
      toast.success('삭제되었습니다');
    } catch {
      toast.error('삭제에 실패했습니다');
    }
  };

  if (isLoading) {
    return <Skeleton className="h-48 w-full" />;
  }

  if (error) {
    return <div>오류가 발생했습니다</div>;
  }

  return (
    <UserListView
      users={users ?? []}
      onDelete={handleDelete}
      onAdd={openCreateModal}
    />
  );
}
```

### 10. Providers 설정 (app/providers.tsx)
```typescript
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'sonner';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1분
            gcTime: 5 * 60 * 1000, // 5분
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster position="top-right" />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

### 11. Layout에 Providers 적용 (app/layout.tsx)
```typescript
import { Providers } from './providers';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

## shadcn/ui 설치 명령어

```bash
npx shadcn@latest add button input label card dialog toast skeleton avatar select
```

## 패키지 설치

```bash
# 상태 관리
npm install zustand @tanstack/react-query

# 폼 + 유효성 검사
npm install react-hook-form @hookform/resolvers zod

# UI
npm install sonner  # Toast

# DevTools (개발용)
npm install -D @tanstack/react-query-devtools
```

## Output Format

```
🚀 구현 시작

✅ Step 1: 타입 정의 - 완료
✅ Step 2: Zod 스키마 - 완료
✅ Step 3: TanStack Query hooks - 완료
✅ Step 4: Zustand store - 완료
✅ Step 5: Server Action - 완료
✅ Step 6: View 컴포넌트 - 완료
✅ Step 7: Container 연결 - 완료
✅ Step 8: Page 통합 - 완료

---

📝 변경 사항 요약

## 생성된 파일
- `types/user.ts`
- `lib/validations/user.ts`
- `hooks/queries/use-users.ts`
- `stores/use-ui-store.ts`
- `components/features/user/user-form.tsx`
- `components/features/user/user-form.container.tsx`
- `components/features/user/user-form.action.ts`

---
✅ 구현 완료!
```
