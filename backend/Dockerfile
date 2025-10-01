# Stage 1: Build the application
FROM eclipse-temurin:21-jdk-jammy AS build

# Install Maven
RUN apt-get update && apt-get install -y maven && rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /app

# Copy the Maven configuration files (pom.xml and .mvn directory)
COPY pom.xml ./
COPY .mvn/ .mvn/

# Download dependencies (this step helps cache dependencies for faster builds)
RUN mvn dependency:go-offline -B

# Copy the source code
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests

# Stage 2: Run the application
FROM eclipse-temurin:21-jre-jammy

# Set the working directory
WORKDIR /app

# Copy the built JAR file from the build stage
COPY --from=build /app/target/Todo-0.0.1-SNAPSHOT.jar .

# Command to run the application
CMD ["java", "-jar", "Todo-0.0.1-SNAPSHOT.jar"]
