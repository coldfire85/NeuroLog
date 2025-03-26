import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center gap-10">
      <section className="w-full pt-12 pb-8 md:pt-16 md:pb-12">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                NeuroLog: Modern<br />Neurosurgical Logbook
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Track, analyze, and export your neurosurgical procedures with an elegant
                interface designed for medical professionals.
              </p>
            </div>
            <div className="flex space-x-4 mt-6">
              <Link href="/procedures">
                <Button className="px-8 py-6 rounded-md text-base">Get Started</Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" className="px-8 py-6 rounded-md text-base">Dashboard</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container px-4 md:px-6 py-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="glass-card">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <div className="mb-4 rounded-full bg-primary/10 p-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-primary"
                >
                  <path d="M14 3v4a1 1 0 0 0 1 1h4"></path>
                  <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z"></path>
                  <line x1="9" y1="9" x2="10" y2="9"></line>
                  <line x1="9" y1="13" x2="15" y2="13"></line>
                  <line x1="9" y1="17" x2="15" y2="17"></line>
                </svg>
              </div>
              <h3 className="text-xl font-bold">Procedure Notes</h3>
              <p className="text-center text-muted-foreground">
                Document your surgical procedures with detailed notes, outcomes, and complications.
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <div className="mb-4 rounded-full bg-primary/10 p-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-primary"
                >
                  <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                  <circle cx="9" cy="9" r="2"></circle>
                  <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold">Operative Images</h3>
              <p className="text-center text-muted-foreground">
                Upload, organize, and manage operative images to document surgical findings.
              </p>
            </CardContent>
          </Card>

          {/* New Video Content Card */}
          <Card className="glass-card">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <div className="mb-4 rounded-full bg-primary/10 p-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-primary"
                >
                  <path d="M12 2c-1.7 0-3 1.2-3 2.6v6.8c0 1.4 1.3 2.6 3 2.6s3-1.2 3-2.6V4.6C15 3.2 13.7 2 12 2z"></path>
                  <path d="M9 9h6"></path>
                  <path d="M19 9v12H5V9"></path>
                  <path d="M5 9a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v0"></path>
                  <circle cx="12" cy="14" r="4"></circle>
                  <path d="m12 12 1.5 1"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold">Surgical Videos</h3>
              <p className="text-center text-muted-foreground">
                Record and catalog your surgical procedures with high-quality video for teaching and review.
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <div className="mb-4 rounded-full bg-primary/10 p-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-primary"
                >
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <path d="M8 13h2"></path>
                  <path d="M8 17h2"></path>
                  <path d="M14 13h2"></path>
                  <path d="M14 17h2"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold">Excel Export</h3>
              <p className="text-center text-muted-foreground">
                Export your logbook data to Excel for analysis, reporting, and academic presentations.
              </p>
            </CardContent>
          </Card>

          {/* New PDF Export Card */}
          <Card className="glass-card">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <div className="mb-4 rounded-full bg-primary/10 p-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-primary"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <path d="M14 2v6h6"></path>
                  <path d="M5 12h14"></path>
                  <path d="M5 18h14"></path>
                  <path d="M5 15h4"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold">PDF Export</h3>
              <p className="text-center text-muted-foreground">
                Generate professional PDF reports of your procedures for sharing with colleagues or inclusion in medical records.
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <div className="mb-4 rounded-full bg-primary/10 p-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-primary"
                >
                  <path d="M7 21a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2z"></path>
                  <path d="M12 7h4"></path>
                  <path d="M12 11h4"></path>
                  <path d="M12 15h4"></path>
                  <path d="M8 7h0"></path>
                  <path d="M8 11h0"></path>
                  <path d="M8 15h0"></path>
                  <path d="M3 21h4"></path>
                  <path d="M3 7h4"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold">Comprehensive Records</h3>
              <p className="text-center text-muted-foreground">
                Maintain detailed records of patient demographics, diagnoses, and outcomes.
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <div className="mb-4 rounded-full bg-primary/10 p-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-primary"
                >
                  <rect width="18" height="18" x="3" y="3" rx="2"></rect>
                  <line x1="9" y1="3" x2="9" y2="21"></line>
                  <path d="M13 8h5"></path>
                  <path d="M13 12h5"></path>
                  <path d="M13 16h5"></path>
                  <path d="M5 8h2"></path>
                  <path d="M5 12h2"></path>
                  <path d="M5 16h2"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold">Radiology Integration</h3>
              <p className="text-center text-muted-foreground">
                Upload and view radiological images alongside your surgical notes.
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <div className="mb-4 rounded-full bg-primary/10 p-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-primary"
                >
                  <path d="M21 8v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8"></path>
                  <path d="M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3H3V5z"></path>
                  <path d="M9 14h6"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold">Mobile Responsive</h3>
              <p className="text-center text-muted-foreground">
                Access your logbook on any device, from desktop to mobile, with a fully responsive design.
              </p>
            </CardContent>
          </Card>

          {/* New Networking Card */}
          <Card className="glass-card">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <div className="mb-4 rounded-full bg-primary/10 p-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-primary"
                >
                  <path d="M16 22h2a2 2 0 0 0 2-2v-5.5l-5-3v-3.5a4 4 0 0 0-4-4h-4a4 4 0 0 0-4 4v3.5l-5 3V20a2 2 0 0 0 2 2h2"></path>
                  <path d="M9 16h6"></path>
                  <path d="M12 16v6"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold">Professional Networking</h3>
              <p className="text-center text-muted-foreground">
                Connect with other neurosurgeons, share insights, and collaborate on cases through our integrated networking features.
              </p>
            </CardContent>
          </Card>

          {/* Data Ownership Card */}
          <Card className="glass-card">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <div className="mb-4 rounded-full bg-primary/10 p-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-primary"
                >
                  <path d="M12 2a3 3 0 0 0-3 3v1h6V5a3 3 0 0 0-3-3z"></path>
                  <path d="M19 5a3 3 0 0 0-3 3v1h4V8a3 3 0 0 0-1-3z"></path>
                  <path d="M5 5a3 3 0 0 0-1 3v1h4V8a3 3 0 0 0-3-3z"></path>
                  <path d="M20 16v-3a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3"></path>
                  <rect width="16" height="8" x="4" y="16" rx="1"></rect>
                </svg>
              </div>
              <h3 className="text-xl font-bold">Own Your Data</h3>
              <p className="text-center text-muted-foreground">
                Store your data directly on your Google Drive or OneDrive. Your data never touches our servers.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="w-full py-12 glass">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Ready to get started?
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Join thousands of neurosurgeons who trust NeuroLog for their procedure tracking needs.
              </p>
            </div>
            <div className="space-x-4">
              <Link href="/procedures">
                <Button className="px-8 py-5 rounded-md text-base">Start Logging</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Logo Circle at bottom left */}
      <div className="fixed bottom-6 left-6 h-12 w-12 bg-black rounded-full flex items-center justify-center">
        <span className="text-white font-bold text-xl">N</span>
      </div>
    </div>
  );
}
