import VismaScraper from "../../components/VismaScraper";

export default function handler(req, res) {
    const body = req.body;
    let website = body.website;

    if (!website) {
        res.status(400).json({ data: 'website not defined' })
    }

    if (!website.startsWith('https://')) {
        website = 'https://' + website;
    }

    let visma = new VismaScraper(website); // should not be class...?
    visma.scrape()
        .then(success => {
            console.log('SUCCESS')
            res.status(200, 'scraping done?').json({ data: 'scraping in progress!' });
        })
        .catch(err => {
            res.status(500, 'something went wrong...');
            console.log(err)
        })
}

