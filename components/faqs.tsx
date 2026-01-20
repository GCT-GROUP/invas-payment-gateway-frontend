export default function Faqs() {
    return (
        <div className="max-w-7xl mx-auto px-8">
            <div className="mt-20 rounded-lg p-8 border border-accent border-l-8">
                <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
                <div className="grid md:grid-cols-2 gap-8">
                    <div>
                    <h3 className="font-semibold mb-2 text-foreground">Can I change my plan later?</h3>
                    <p className="text-muted-foreground">
                        Yes, you can upgrade or downgrade your plan at any time. Changes take effect on your next billing cycle.
                    </p>
                    </div>
                    <div>
                    <h3 className="font-semibold mb-2 text-foreground">What payment methods do you accept?</h3>
                    <p className="text-muted-foreground">
                        We accept all major credit cards, debit cards, and bank transfers for eligible regions.
                    </p>
                    </div>
                    <div>
                    <h3 className="font-semibold mb-2 text-foreground">Is there a free trial?</h3>
                    <p className="text-muted-foreground">
                        Contact our sales team to discuss free trial options for enterprise plans.
                    </p>
                    </div>
                </div>
            </div>
        </div>
    )
}