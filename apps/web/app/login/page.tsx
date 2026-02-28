import { login, signup } from './actions'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input, Label } from '@/components/ui/input'
import { Activity } from 'lucide-react'

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-secondary/30 p-4">
            <Card className="w-full max-w-sm">
                <CardHeader className="text-center pb-2">
                    <div className="flex justify-center mb-4">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <Activity className="h-6 w-6" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold">Inpro PM</CardTitle>
                    <CardDescription>Sign in to your account</CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email address</Label>
                            <Input id="email" name="email" type="email" placeholder="admin@inpro.local" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" name="password" type="password" required />
                        </div>

                        <div className="flex flex-col gap-2 pt-2">
                            <Button formAction={login} className="w-full">Sign In</Button>
                            {/* <Button variant="outline" formAction={signup} className="w-full">Sign Up</Button> */}
                        </div>

                        <div className="text-xs text-center text-muted-foreground mt-4 pt-4 border-t">
                            Use dummy accounts: <br />
                            <code className="bg-muted px-1 py-0.5 rounded">admin@inpro.local</code> or <code className="bg-muted px-1 py-0.5 rounded">manager@buildcorp.local</code><br />
                            Password for both: <code className="bg-muted px-1 py-0.5 rounded">password123</code> (if set in Supabase auth)
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
