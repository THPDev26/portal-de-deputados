import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;

public class Main {

    public static void main(String[] args) throws IOException {
        int porta = 8080;
        HttpServer server = HttpServer.create(new InetSocketAddress(porta), 0);

        // Serve os arquivos estáticos (index.html, style.css, script.js)
        server.createContext("/", new StaticFileHandler());

        // Proxy Java para consumir a API da Câmara dos Deputados sem problemas de CORS
        server.createContext("/api/camara", new CamaraApiProxyHandler());

        server.setExecutor(null);
        System.out.println("==========================================");
        System.out.println("🚀 Servidor Java Backend rodando na porta " + porta);
        System.out.println("==========================================");
        server.start();
    }

    // Handler para entregar arquivos estáticos (HTML, CSS, JS)
    static class StaticFileHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            String path = exchange.getRequestURI().getPath();
            if (path.equals("/")) {
                path = "/index.html";
            }

            File file = new File("." + path);
            if (!file.exists() || file.isDirectory()) {
                String response = "404 - Arquivo Não Encontrado pelo Servidor Java";
                exchange.sendResponseHeaders(404, response.length());
                OutputStream os = exchange.getResponseBody();
                os.write(response.getBytes());
                os.close();
                return;
            }

            // Define o Content-Type correto para cada tipo de arquivo
            String contentType = "text/html";
            if (path.endsWith(".css")) {
                contentType = "text/css";
            } else if (path.endsWith(".js")) {
                contentType = "text/javascript";
            }

            exchange.getResponseHeaders().set("Content-Type", contentType + "; charset=UTF-8");
            exchange.sendResponseHeaders(200, file.length());

            OutputStream os = exchange.getResponseBody();
            FileInputStream fs = new FileInputStream(file);
            byte[] buffer = new byte[1024];
            int count;
            while ((count = fs.read(buffer)) >= 0) {
                os.write(buffer, 0, count);
            }
            fs.close();
            os.close();
        }
    }

    // Handler Java que faz a requisição HTTP para a API da Câmara dos Deputados
    static class CamaraApiProxyHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            String query = exchange.getRequestURI().getQuery();
            String targetUrl = "https://dadosabertos.camara.leg.br/api/v2/deputados"
                    + (query != null ? "?" + query : "");

            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(targetUrl))
                    .header("Accept", "application/json")
                    .GET()
                    .build();

            try {
                HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

                exchange.getResponseHeaders().set("Content-Type", "application/json; charset=UTF-8");
                exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");

                byte[] bytes = response.body().getBytes(StandardCharsets.UTF_8);
                exchange.sendResponseHeaders(response.statusCode(), bytes.length);

                OutputStream os = exchange.getResponseBody();
                os.write(bytes);
                os.close();
            } catch (Exception e) {
                String error = "{\"error\": \"Falha ao conectar com a API via Java Backend\"}";
                exchange.sendResponseHeaders(500, error.length());
                exchange.getResponseBody().write(error.getBytes());
                exchange.getResponseBody().close();
            }
        }
    }
}