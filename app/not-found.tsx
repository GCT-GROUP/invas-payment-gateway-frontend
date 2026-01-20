import Header from "@/components/header"
import Footer from "@/components/footer"
import { SUPPORT_EMAIL } from "@/lib/constants"

export default function NotFound() {
    return (
        <main className="min-h-screen bg-gradient-to-b from-background to-muted flex flex-col">
            <Header />
            
            <div className="flex-1 flex items-center justify-center px-4 py-20">
                <div className="max-w-2xl w-full text-center space-y-8">
                    {/* 404 Number */}
                    <div className="relative">
                        <h1 className="text-8xl md:text-[10rem] font-bold gradient-text-alt select-none">
                            404
                        </h1>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-5xl md:text-7xl lg:text-8xl animate-[bounce_1.5s_infinite]">🔍</div>
                        </div>
                    </div>

                    {/* Error Message */}
                    <div className="space-y-4">
                        <h2 className="text-3xl md:text-4xl font-bold text-primary">
                            Page Not Found
                        </h2>
                        <p className="text-lg text-primary/90 max-w-md mx-auto">
                            Sorry, we couldn't find the page you're looking for. The link may be broken or the page may have been removed.
                        </p>
                    </div>

                    {/* Action Buttons */}
                    {/* <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                        <Link href="/" className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl" >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                            </svg>
                            Go Home
                        </Link>
                        // onClick={() => window.history.back()}
                        <button className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-secondary text-secondary-foreground font-medium hover:bg-secondary/80 transition-colors">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Go Back
                        </button>
                    </div> */}

                    {/* Additional Help */}
                    <div className="pt-8 border-t border-border/50">
                        <p className="text-sm text-muted-foreground">
                            Need help? Contact our support team at <a className="text-blue-900 hover:underline cursor-pointer" href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
                        </p>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    )
}