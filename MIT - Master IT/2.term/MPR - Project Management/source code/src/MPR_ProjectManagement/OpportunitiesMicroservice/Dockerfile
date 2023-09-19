#See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:7.0-alpine3.17 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:7.0-alpine3.17 AS build
WORKDIR /src
COPY ["OpportunitiesMicroservice/OpportunitiesMicroservice.csproj", "OpportunitiesMicroservice/"]
RUN dotnet restore "OpportunitiesMicroservice/OpportunitiesMicroservice.csproj"
COPY . .
WORKDIR "/src/OpportunitiesMicroservice"
RUN dotnet build "OpportunitiesMicroservice.csproj" -c Debug -o /app/build

FROM build AS publish
RUN dotnet publish "OpportunitiesMicroservice.csproj" -c Debug -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "OpportunitiesMicroservice.dll"]