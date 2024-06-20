'use client';
import * as Clerk from '@clerk/elements/common';
import * as SignUp from '@clerk/elements/sign-up';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Icons } from '@/components/ui/icons';
export default function Page() {
  return <div className="grid w-full grow items-center px-4 sm:justify-center">
    <SignUp.Root>
      <Clerk.Loading>
        {(isGlobalLoading) => (
          <>
            <SignUp.Step name="start">
              <Card className="w-full sm:w-96">
                <CardHeader className='flex flex-col'>
                  <CardTitle>Create your account</CardTitle>
                  <CardDescription>Welcome! Please fill in the details to get started.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-y-4">
                  <div className="grid grid-cols-2 gap-x-4">
                    <Clerk.Connection name="github" asChild>
                      <Button size="sm" variant="outline" disabled={isGlobalLoading}>
                        <Clerk.Loading scope="provider:github">
                          {(isLoading) =>
                            isLoading ? (
                              <Icons.spinner className="size-4 animate-spin" />
                            ) : (
                              <>
                                <Icons.gitHub className="mr-2 size-4" />
                                GitHub
                              </>
                            )
                          }
                        </Clerk.Loading>
                      </Button>
                    </Clerk.Connection>
                    <Clerk.Connection name="google" asChild>
                      <Button size="sm" variant="outline" disabled={isGlobalLoading}>
                        <Clerk.Loading scope="provider:google">
                          {(isLoading) =>
                            isLoading ? (
                              <Icons.spinner className="size-4 animate-spin" />
                            ) : (
                              <>
                                <Icons.google className="mr-2 size-4" />
                                Google
                              </>
                            )
                          }
                        </Clerk.Loading>
                      </Button>
                    </Clerk.Connection>
                  </div>
                  <p className="flex items-center gap-x-3 text-sm text-muted-foreground before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border">
                    or
                  </p>
                  <Clerk.Field name="emailAddress" className="space-y-2">
                    <Clerk.Label asChild>
                      <Label>Email address</Label>
                    </Clerk.Label>
                    <Clerk.Input type="text" required asChild>
                      <Input />
                    </Clerk.Input>
                    <Clerk.FieldError className="block text-sm text-destructive" />
                  </Clerk.Field>
                  <Clerk.Field name="password" className="space-y-2">
                    <Clerk.Label asChild>
                      <Label>Password</Label>
                    </Clerk.Label>
                    <Clerk.Input type="password" required asChild>
                      <Input />
                    </Clerk.Input>
                    <Clerk.FieldError className="block text-sm text-destructive" />
                  </Clerk.Field>
                </CardContent>
                <CardFooter>
                  <div className="grid w-full gap-y-4">
                    <SignUp.Action submit asChild>
                      <Button disabled={isGlobalLoading}>
                        <Clerk.Loading>
                          {(isLoading) => {
                            return isLoading ? <Icons.spinner className="size-4 animate-spin" /> : 'Continue';
                          }}
                        </Clerk.Loading>
                      </Button>
                    </SignUp.Action>
                    <Button variant="link" size="sm" asChild>
                      <Link href="/sign-in">Already have an account? Sign in</Link>
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </SignUp.Step>

            <SignUp.Step name="continue">
              <Card className="w-full sm:w-96">
                <CardHeader>
                  <CardTitle>Continue registration</CardTitle>
                </CardHeader>
                <CardContent>
                  <Clerk.Field name="username" className="space-y-2">
                    <Clerk.Label>
                      <Label>Username</Label>
                    </Clerk.Label>
                    <Clerk.Input type="text" required asChild>
                      <Input />
                    </Clerk.Input>
                    <Clerk.FieldError className="block text-sm text-destructive" />
                  </Clerk.Field>
                </CardContent>
                <CardFooter>
                  <div className="grid w-full gap-y-4">
                    <SignUp.Action submit asChild>
                      <Button disabled={isGlobalLoading}>
                        <Clerk.Loading>
                          {(isLoading) => {
                            return isLoading ? <Icons.spinner className="size-4 animate-spin" /> : 'Continue';
                          }}
                        </Clerk.Loading>
                      </Button>
                    </SignUp.Action>
                  </div>
                </CardFooter>
              </Card>
            </SignUp.Step>

            <SignUp.Step name="verifications">
              <SignUp.Strategy name="code">
                <Card className="w-full sm:w-96">
                  <CardHeader className='flex flex-col'>
                    <CardTitle>Verify your email</CardTitle>
                    <CardDescription>Use the verification link sent to your email address</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-y-4">
                    <Clerk.Field name="code">
                      <Clerk.Label className="sr-only">Verification code</Clerk.Label>
                      <div className="grid items-center justify-center gap-y-2">
                        <Clerk.Field name="code" className="space-y-2">
                          <Clerk.Label asChild>
                            <Label className="sr-only">Email address</Label>
                          </Clerk.Label>
                          <div className="flex justify-center text-center">
                            <Clerk.Input
                              type="otp"
                              className="flex justify-center has-[:disabled]:opacity-50"
                              autoSubmit
                              render={({ value, status }) => {
                                return (
                                  <div
                                    data-status={status}
                                    className="relative flex size-9 items-center justify-center border-y border-r border-input text-sm shadow-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md data-[status=cursor]:ring-1 data-[status=selected]:ring-1 data-[status=cursor]:ring-ring data-[status=selected]:ring-ring"
                                  >
                                    {value}
                                  </div>
                                );
                              }}
                            />
                          </div>
                          <Clerk.FieldError className="block text-center text-sm text-destructive" />
                        </Clerk.Field>
                        <SignUp.Action
                          asChild
                          resend
                          className="text-muted-foreground"
                          fallback={({ resendableAfter }) => (
                            <Button variant="link" size="sm" disabled>
                              Didn&apos;t recieve a code? Resend (
                              <span className="tabular-nums">{resendableAfter}</span>)
                            </Button>
                          )}
                        >
                          <Button variant="link" size="sm">
                            Didn&apos;t recieve a code? Resend
                          </Button>
                        </SignUp.Action>
                      </div>
                    </Clerk.Field>
                  </CardContent>
                  <CardFooter>
                    <div className="grid w-full gap-y-4">
                      <SignUp.Action submit asChild>
                        <Button disabled={isGlobalLoading}>
                          <Clerk.Loading>
                            {(isLoading) => {
                              return isLoading ? <Icons.spinner className="size-4 animate-spin" /> : 'Continue';
                            }}
                          </Clerk.Loading>
                        </Button>
                      </SignUp.Action>
                    </div>
                  </CardFooter>
                </Card>
              </SignUp.Strategy>
            </SignUp.Step>
          </>
        )}
      </Clerk.Loading>
    </SignUp.Root>
  </div>;
}