import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Logo } from "@/components/ui/logo";
import Link from "next/link";

export default function NotFound() {
  return (
    <Card className="text-center">
      <CardHeader>
        <CardTitle>404 : Not Found</CardTitle>
        <CardDescription>Could not find requested resource</CardDescription>
      </CardHeader>
      <CardFooter className="flex justify-between">
        <Link href="/dashboard/workspace" className="w-full">
          <Button className="w-full">Go to Workspace</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
