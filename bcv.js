const puppeteer = require('puppeteer');

async function getBCV() {
    // Lanzamos el navegador
    const browser = await puppeteer.launch({ 
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox'] 
    });

    try {
        const page = await browser.newPage();
        
        // Configuramos un "User Agent" para que el BCV piense que somos un Chrome normal de Windows
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36');

        console.log("Conectando al BCV...");
        await page.goto('http://www.bcv.org.ve/', { 
            waitUntil: 'networkidle2', 
            timeout: 60000 
        });

        // TÉCNICA DE ESPERA: Le decimos a Node que espere a que el ID 'dolar' exista en la página
        console.log("Esperando que carguen las tasas...");
        await page.waitForSelector('#dolar', { timeout: 10000 });

        const tasas = await page.evaluate(() => {
            // Buscamos los contenedores de las tasas
            const divDolar = document.querySelector('#dolar strong');
            const divEuro = document.querySelector('#euro strong');

            // Si los encuentra, devuelve el texto; si no, devuelve "No encontrado"
            return {
                dolar: divDolar ? divDolar.innerText.trim() : "No encontrado",
                euro: divEuro ? divEuro.innerText.trim() : "No encontrado"
            };
        });

        if (tasas.dolar === "No encontrado") {
            throw new Error("No se encontraron los selectores #dolar o #euro. Es posible que el diseño de la página cambiara.");
        }

        console.log("--- TASAS OFICIALES BCV ---");
        console.log(`Dólar: ${tasas.dolar} VES`);
        console.log(`Euro: ${tasas.euro} VES`);

        return tasas;

    } catch (error) {
        console.error("Error detallado:", error.message);
        
        // TIP DE PRO: Si falla, podemos decirle que tome una captura de pantalla 
        // para ver qué está viendo el script realmente.
        // await page.screenshot({ path: 'error_bcv.png' }); 
        
    } finally {
        await browser.close();
    }
}

module.exports = { getBCV };