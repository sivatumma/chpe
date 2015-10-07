/**
 * Set the environment variables 
 * 
 *
 * NODE_ENV to “production” to run the app in production mode.
 * 
 *
 */
var path = require('path'),
    root_path = path.normalize(__dirname),
    _ = require('lodash');

module.exports = function(env) {
    var main = {
        application: {
          // root_path: path.join('/home', 'siva', 'Downloads', 'chpe-polymer-1.0.3'),
            // root_path: path.join('C:','Work','chpe-1.0'),
            root_path: "C:\\Users\\inthiyaz.karamala.CHSPLDC\\WebstormProjects\\chpe-1.0",
            addPrefixes: process.argv[2],
            logFilenamePrefix: "",
            modelNamePrefix: "",
            http_port: 90,
            https_port: 443
        },
        logFiles: {
            databaseLogFile: "db.log",
            webserverLogFile: "web.log",
            exceptionLogFile: "exceptions.log",
            plainLogFile: "pricingEngine.log"
        },

        configVariable: {
            user: {
                Discount: 9
            },
            admin: {
                Discount: 30
            },
            loginUser: "user"
        },

        modelsFolder: '../models',
        database: 'mongodb://172.19.4.162/pricingEngine',
        memcache_host: 'http://172.16.2.113:8081/AutoSuggestion/rest',
        app_name: 'Pricing Engine',
        app_root: root_path,
        temp: path.join('D:', 'temp'),
        certificates_dir: path.join('C:', 'self-signed'),
        old_pricing_engine_app_root: path.join('C:', 'work', 'PricingEngine', 'baseUI'),
        pricing_engine_app_root: path.join('C:', 'work', 'chpe', 'src-ui', 'html', 'schemes.html'),
        approvedAuthorizedAPIKeys: ["EWELLNESS-b0b54538-d200-4f26-a88c-b61b5a5bc873",
            "CUSTOMER_PORTAL-56eddb9f-25ee-4cb4-964c-e37169f434c9",
            "MEDIBUS-12ed15e7-bc20-45c5-88dc-684bb32a9dd9",
            "2e47d922-f4e9-4ad9-a45c-881717ef4a15",
            "2f158555-034f-4f45-897c-e016ee9d7020",
            "dbb0886f-bb41-48d9-b69c-967f2039cd6e",
            "42196bae-9370-4a13-accc-0d18e0e8f196",
            "52d0747f-2bb1-438e-879a-84726c4f90d0",
            "ca02de7a-efd3-4f1b-a79f-d30b8bccfa07",
            "b87ccd77-b5ac-4c8b-b8cc-3c59a64cdb07",
            "6a279900-59dc-4b01-9a1b-cf2db8988ace",
            "c3cdda34-20a6-4cba-a2dd-59317612d781",
            "9e34d7ea-dc16-4355-99a7-79b9b509f842",
            "9dbe2322-93b2-4705-8ccd-cc0afbeaef30",
            "387414e4-3b97-4e5d-978f-9f14264000aa",
            "f1817fe4-73b8-4028-bc83-073f19d0087a",
            "5d8b2d86-9a85-4569-8e1b-4378c4ed1cc1",
            "35141f48-d078-414e-afda-388f98914adc",
            "ddefd426-b8b9-4e10-886d-24ecfb13024e",
            "66ff59f4-730d-4182-86bb-a0c39737607f"
        ]
    };
    var dev = {
        database: 'mongodb://172.19.4.162/pricingEngine',
        env: 'development',
        old_pricing_engine_app_root: path.join('C:', 'work', 'PricingEngine', 'baseUI'),
        pricing_engine_app_root: path.join('C:', 'work', 'chpe', 'src-ui', 'html'),
        services_json_path: path.join('C:', 'work', 'chpe', 'src-ui', 'services.json')
    };
    var prod = {
        database: 'mongodb://localhost/pricingEngine',
        temp: path.join('/', 'tmp'),
        env: 'production',
        certificates_dir: path.join('/', 'etc', 'ssl', 'self-signed'),
        // mobile_app_root:path.join('/','opt','cisco-pricing_engine-mobile-app'),
        // portal_app_root:path.join('/','opt','cisco-pricing_engine-portal-app'),
        // mobile_app_debug_root:path.join('/','opt','cisco-pricing_engine-mobile-app-Debug'),
        // pricing_engine_app_root: path.join('/', 'root', 'siva', 'PricingEngine', 'baseUI'),
        pricing_engine_app_root: path.join('/', 'root', 'siva', 'chpe', 'src-ui'),
        services_json_path: path.join('/', 'root', 'siva', 'PricingEngine', 'baseUI', 'services.json'),
    }
    return _.extend(main, (env == 'dev') ? dev : prod);
}()