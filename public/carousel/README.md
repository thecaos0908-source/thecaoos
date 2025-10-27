# Pasta de Imagens do Carrossel

## Como Adicionar Imagens

1. **Adicione suas imagens** nesta pasta (`public/carousel/`)
2. **Formatos suportados**: JPG, PNG, WebP
3. **Tamanho recomendado**: 1200x800px ou proporção 3:2
4. **Nomes dos arquivos**: Use nomes descritivos como:
   - `local-1.jpg`
   - `local-2.jpg`
   - `local-3.jpg`
   - `interior-1.jpg`
   - `exterior-1.jpg`

## Exemplo de Estrutura

```
public/carousel/
├── README.md
├── local-1.jpg
├── local-2.jpg
├── local-3.jpg
├── interior-1.jpg
└── exterior-1.jpg
```

## Configuração no Código

As imagens são carregadas automaticamente do diretório `public/carousel/`. 

Para adicionar novas imagens, edite o arquivo `src/pages/Index.tsx` e adicione os nomes dos arquivos no array `carouselImages`.

## Dicas

- **Qualidade**: Use imagens de alta qualidade
- **Otimização**: Comprima as imagens para web (recomendado < 500KB cada)
- **Responsividade**: As imagens se ajustam automaticamente a diferentes tamanhos de tela
- **Acessibilidade**: Use nomes descritivos para melhor SEO
